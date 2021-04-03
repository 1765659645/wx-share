import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Input, Image } from "@tarojs/components";
import "./index.less";

interface wSearchProps {
  isFocus: boolean; //是否自动获取焦点
  theme: string; //选择块级显示还是圆形显示
  showWant: boolean; //是否展示推荐菜单
  hotList: any[]; //推荐列表数据
  isImageSearch: boolean; //是否有上传图片搜索
  getSearchText: (value) => void;
  getSearchImage: (value) => void;
}

const Search: React.FC<wSearchProps> = ({
  isFocus = false,
  theme = "block",
  showWant = false,
  hotList = [],
  isImageSearch = false,
  getSearchText,
  getSearchImage,
}) => {
  const [searchText, setSearchText] = useState("");

  function searchStart() {
    //触发搜索

    if (searchText == "") {
      Taro.showToast({
        title: "请输入关键字",
        icon: "none",
        duration: 1000,
      });
    } else {
      getSearchText(searchText);
      Taro.getStorage({
        key: "search_cache",
        success(res) {
          console.log(res);
          let list = res.data;
          if (list.length > 5) {
            for (let item of list) {
              if (item == searchText) {
                return;
              }
            }
            list.pop();
            list.unshift(searchText);
          } else {
            for (let item of list) {
              if (item == searchText) {
                return;
              }
            }
            list.unshift(searchText);
          }
        },
        fail(err) {},
      });
    }
  }

  function keywordsClick(item, e) {
    //关键词搜索与历史搜索
    console.log(item);
    setSearchText(item);
    searchStart();
  }

  function imageSearch() {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], //从相册选择
      success: (res) => {
        getSearchImage(res.tempFilePaths);
      },
      fail: (err) => {},
    });
  }

  function handleChane(e) {
    setSearchText(e.target.value);
  }
  return (
    <View>
      <View className="search">
        {isFocus ? (
          <Input
            maxLength="20"
            focus
            type="text"
            onInput={handleChane}
            value={searchText}
            confirmType="search"
            onConfirm={searchStart}
            placeholder="请输入关键词搜索"
          />
        ) : (
          <Input
            maxLength="20"
            type="text"
            onInput={handleChane}
            value={searchText}
            confirmType="search"
            onConfirm={searchStart}
            placeholder="请输入关键词搜索"
          />
        )}
        <Image
          src={require("./static/search.svg")}
          mode="aspectFit"
          className="search-left-icon"
        ></Image>
        {isImageSearch ? (
          <Image
            src={require("./static/search-right.png")}
            mode="aspectFit"
            onClick={imageSearch}
            className="search-right-icon"
          ></Image>
        ) : null}
      </View>

      {showWant ? (
        <View className={"wanted-" + theme}>
          <View className="header">猜你想搜的</View>
          <View className="list">
            {hotList.map((item, index) => {
              return (
                <View key={index} onClick={keywordsClick.bind(this, item)}>
                  {item}
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Search;
