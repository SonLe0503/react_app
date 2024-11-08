/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import Picker from "emoji-picker-react";

import axios from "axios";

import * as cheerio from "cheerio";

import "./StickerPicker.css";
const baseURL = "http://cdn.jerrytsq.asia:8080/stickers/";
function StickerPicker({ handleSelectedReactIcon }) {
  const [activeTab, setActiveTab] = useState("emoji");
  const [stickers, setStickers] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);

  const onEmojiClick = (emojiData) => {
    handleSelectedReactIcon({
      type: "emoji",
      data: emojiData.emoji,
    });
  };

  function handleClickSticker(event) {
    handleSelectedReactIcon({
      type: "sticker",
      data: event.target.src,
    });
  }

  useEffect(() => {
    if (activeTab === "Gifs") {
      fetchGifs(searchQuery, 0);
    }
  }, [activeTab, searchQuery]);
  const fetchGifs = async (query, offset) => {
    try {
      const endpoint = query ? "search" : "trending";
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/${endpoint}`,
        {
          params: {
            api_key: "0XmWL4pABnjSg8w6cr4Ro4rzGC9MOFv3",
            q: query,
            limit: 20,
            offset: offset,
          },
        }
      );

      setGifs((prevGifs) =>
        offset === 0 ? response.data.data : [...prevGifs, ...response.data.data]
      );
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    }
  };
  const handleScroll = (e) => {
    console.log("scroll");
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      const newOffset = offset + 20;
      setOffset(newOffset);
      fetchGifs(searchQuery, newOffset);
    }
  };
  const getImageUrls = async (url) => {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const urls = [];
    $("a").each((_, element) => {
      const link = $(element).attr("href");
      if (link) {
        if (link.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          urls.push(`${url}/${link}`);
        }
      }
    });
    return urls;
  };

  const getFoldersWithImages = async (url) => {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const folderData = [];
    $("a").each((_, element) => {
      const link = $(element).attr("href");
      if (link && !link.includes(".")) {
        const folderName = link;
        const folderUrl = `${url}${folderName}`;
        const images = getImageUrls(folderUrl);

        folderData.push({ folderName, images });
      }
    });
    return Promise.all(
      folderData.map(async (folder) => ({
        folderName: folder.folderName,
        images: await folder.images,
      }))
    );
  };
  useEffect(() => {
    const load = async () => {
      const loadStickers = await getFoldersWithImages(baseURL);
      setStickers(loadStickers);
    };
    load();
  }, []);
  return (
    <>
      <div className="sticker_container">
        <div className="sticker_header">
          <div
            className={`tab ${activeTab === "emoji" ? "active" : ""}`}
            onClick={() => setActiveTab("emoji")}
          >
            Emoji
          </div>
          <div
            className={`tab ${activeTab === "stickers" ? "active" : ""}`}
            onClick={() => setActiveTab("stickers")}
          >
            Sticker
          </div>
          <div
            className={`tab ${activeTab === "Gifs" ? "active" : ""}`}
            onClick={() => setActiveTab("Gifs")}
          >
            Gifs
          </div>
        </div>
        <div className="sticker_content">
          {activeTab === "emoji" && (
            <Picker
              style={{
                width: "100%",
                border: "none",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderRadius: 0,
                boxSizing: "border-box",
                height: "100%",
              }}
              searchDisabled
              previewConfig={{
                showPreview: false,
              }}
              className="content_picker"
              onEmojiClick={onEmojiClick}
            ></Picker>
          )}
          {activeTab === "stickers" && (
            <div className="content_stickers">
              {stickers.map((stickerGroup, index) => (
                <div key={index}>
                  <div className="content_stickers_group">
                    {stickerGroup.folderName.replaceAll("/", "")}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                    }}
                  >
                    {stickerGroup.images.map((sticker, idx) => (
                      <img
                        key={idx}
                        src={sticker}
                        alt={`sticker-${idx}`}
                        onClick={handleClickSticker}
                        className="content_stickers_img"
                      ></img>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "Gifs" && (
            <div className="content_Gifs">
              <input
                type="text"
                placeholder="Search GIFs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOffset(0);
                }}
                className="Gifs_search"
              ></input>
              <div className="Gifs_listelement" onScroll={handleScroll}>
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="Gifs_element"
                    onClick={() =>
                      handleSelectedReactIcon({
                        type: "gif",
                        data: gif.images.fixed_height.url,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default StickerPicker;
