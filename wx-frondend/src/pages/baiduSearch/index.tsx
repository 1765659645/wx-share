import React, { useState, useEffect } from "react";
import { View, Text, Ad, RichText } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { TabBar, Search } from "../../components";
import { formatTimeTwo } from "../../utils";

const BaiduSearch: React.FC = () => {
  const [searchData, setSearchData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessage, setTotalMessage] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [isViewAd, setIsViewAd] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    Taro.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
  }, []);

  useEffect(() => {
    if (searchValue) {
      setIsViewAd(false);
      setSearchData([]);
      setCurrentPage(1);
      setTotalMessage(null);
      Taro.showLoading({
        title: "加载中",
        mask: true,
      });
      Taro.request({
        url: "https://byg0.com/resource",
        method: "GET",
        data: {
          key: searchValue,
          page: currentPage,
          pageSize,
        },
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.error === "success") {
              Taro.hideLoading();
              setSearchData(res.data.data.result);
              setCurrentPage(res.data.data.currentPage);
              setTotalMessage(
                `搜索到${res.data.data.amount}条数据, 耗时${res.data.data.time}秒`
              );
            }
            console.log(res.data);
          }
        },
        fail: (err) => {},
      });
    }
  }, [searchValue]);

  function handleSearch(value) {
    setSearchValue(value);
  }

  function getUrl(url, psd) {
    if (!isViewAd) {
      Taro.showToast({
        title: "您还没有观看视频哦",
        icon: "none",
      });
      return;
    }
    Taro.setClipboardData({
      data: `资源链接：${url}, 提取码：${psd}`,
    });
  }

  function handleMore() {
    Taro.showLoading({
      title: "加载中",
      mask: true,
    });
    Taro.request({
      url: "https://byg0.com/resource",
      method: "GET",
      data: {
        key: searchValue,
        page: currentPage + 1,
        pageSize,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.error === "success") {
            Taro.hideLoading();
            const newData = [...searchData, ...res.data.data.result];
            setSearchData(newData);
            setCurrentPage(res.data.data.currentPage);
          }
        }
      },
      fail: (err) => {},
    });
  }

  function viewAd() {
    const videoAd = Taro.createRewardedVideoAd({
      adUnitId: "adunit-f24d86580f4cebc5",
    });

    videoAd.load().then(() => {
      videoAd.show();
    });

    videoAd.onError(() =>
      Taro.showModal({
        title: "提示",
        content: "广告加载失败，请尝试重新观看广告",
      })
    );

    videoAd.onClose((res) => {
      if (res.isEnded) {
        setIsViewAd(true);
      }
    });
  }

  console.log(searchData);

  return (
    <View
      style={{
        height: "100%",
        margin: "0 10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          boxShadow: "0 3px 6px -4px rgb(0,0,0, 0.12)",
          paddingBottom: "5px",
        }}
      >
        <Search getSearchText={handleSearch} />

        {totalMessage && (
          <View style={{ marginTop: "5px", paddingBottom: "5px" }}>
            <View
              style={{
                backgroundColor: "#e9e9e9",
                height: "1px",
                margin: "5px 0",
                width: "100%",
              }}
            ></View>
            <View style={{ color: "#5f646e", fontSize: "14px" }}>
              {totalMessage}
            </View>
            {!isViewAd && (
              <View>
                <Text style={{ color: "#5f646e", fontSize: "14px" }}>
                  您仅需要观看一条视频广告即可获取该资源下所有搜索到的结果
                </Text>
                <View
                  style={{
                    backgroundColor: "#52c41a",
                    width: "50%",
                    borderRadius: "50px",
                    fontSize: "14px",
                    padding: "4px",
                    textAlign: "center",
                    margin: "5px auto 0",
                    color: "#fff",
                  }}
                  onClick={viewAd}
                >
                  点击立即观看解锁
                </View>
              </View>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          flexGrow: 1,
          height: 0,
          overflowY: "scroll",
          width: "100%",
          fontSize: "15px",
        }}
      >
        <Ad adIntervals={30} unitId="adunit-9e3516cef285e6c7" />
        {searchData.map((item) => (
          <View
            style={{
              border: "1px solid #e9e9e9",
              borderRadius: "10px",
              margin: "10px 0",
              padding: "10px",
              boxShadow: "0 3px 6px -4px rgb(0,0,0, 0.12)",
            }}
          >
            <RichText
              style={{ fontSize: "14px", color: "#1890ff" }}
              nodes={item.title}
            />
            <View
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#e9e9e9",
                margin: "10px 0",
              }}
            ></View>
            <View style={{ margin: "5px 0" }}>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>类型：</Text>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>
                {item.categoryName}
              </Text>
            </View>
            <View style={{ margin: "5px 0" }}>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>
                文件大小：
              </Text>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>
                {item.size}
              </Text>
            </View>
            <View style={{ margin: "5px 0" }}>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>
                分享时间：
              </Text>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>
                {formatTimeTwo(item.shareTime, "Y/M/D h:m:s")}
              </Text>
            </View>
            <View style={{ margin: "5px 0" }}>
              <Text style={{ fontSize: "14px", color: "#5f646e" }}>描述：</Text>
              <RichText
                style={{ fontSize: "14px", color: "#5f646e" }}
                nodes={item.content}
              />
            </View>
            <View
              onClick={() => getUrl(item.url, item.password)}
              style={{
                width: "50%",
                backgroundColor: "#1890ff",
                borderRadius: "50px",
                height: "30px",
                color: "#fff",
                margin: "0 auto",
                textAlign: "center",
                lineHeight: "30px",
              }}
            >
              获取链接
            </View>
          </View>
        ))}
        {searchData.length !== 0 && (
          <View
            style={{
              width: "100%",
              backgroundColor: "#1890ff",
              borderRadius: "50px",
              height: "30px",
              color: "#fff",
              margin: "0 auto",
              textAlign: "center",
              lineHeight: "30px",
            }}
            onClick={handleMore}
          >
            加载更多
          </View>
        )}
      </View>
      <View style={{ borderTop: "1px solid #e9e9e9" }}>
        <TabBar
          noSplit
          width="50%"
          dots={[]}
          activeColor="#688aef"
          style={{ fontWeight: 400, color: "#999" }}
          defaultSelect={"网盘搜索"}
          options={["特定搜索", "网盘搜索"]}
          onChange={(tabName) => {
            if (tabName !== "网盘搜索") {
              Taro.redirectTo({
                url: "../index/index",
              });
            }
          }}
        ></TabBar>
      </View>
    </View>
  );
};

export default BaiduSearch;
