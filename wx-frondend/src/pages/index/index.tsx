import { Component } from "react";
import { View, Text, Ad, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { TabBar } from "../../components";
import "./index.less";

export default class Index extends Component {
  state = {
    shareKey: "",
    data: null,
    canViewShare: false,
    haveData: null,
    tabName: "特定搜索",
  };
  componentWillMount() {}

  componentDidMount() {
    Taro.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClick = () => {
    this.setState(
      {
        data: null,
        canViewShare: false,
        haveData: null,
      },
      () => {
        const { shareKey } = this.state;
        if (!shareKey || shareKey === "") {
          return;
        }
        Taro.request({
          url: "https://byg0.com/queryShare",
          method: "GET",
          data: {
            shareKey,
          },
          success: (res) => {
            if (res.statusCode === 200) {
              this.setState({
                data: res.data,
                haveData: true,
              });
            } else {
              this.setState({
                haveData: false,
              });
            }
          },
          fail: (err) => {
            if (!err.data) {
              this.setState({
                haveData: false,
              });
            }
          },
        });
      }
    );
  };

  handleInput = (e) => {
    this.setState({
      shareKey: e.detail.value,
    });
  };

  handleClickViewAd = () => {
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
        this.setState({
          canViewShare: true,
          haveData: null,
        });
      }
    });
  };

  handleClickCopyUrl = (data) => {
    Taro.setClipboardData({
      data,
    });
  };

  handleClickCopyPsw = (data) => {
    Taro.setClipboardData({
      data,
    });
  };

  render() {
    const { data, canViewShare, haveData } = this.state;

    return (
      <View className="index">
        <Ad adIntervals={30} unitId="adunit-9e3516cef285e6c7" />

        <View>
          <Text className="label">请输入你需要搜索的内容</Text>
        </View>

        <Input className="input" onInput={this.handleInput} />
        <Button
          style={{
            width: "30%",
            borderRadius: "50px",
            fontSize: "14px",
            textAlign: "center",
            margin: "5px auto 0",
            color: "#fff",
            height: "30px",
            lineHeight: "30px",
          }}
          className="query"
          onClick={this.handleClick}
        >
          查询
        </Button>
        {haveData && (
          <>
            <View>
              已搜索到相关资源，您需要观看广告解锁资源信息, 点击下方按钮观看广告
            </View>
            <Button onClick={this.handleClickViewAd} className="viewAd">
              观看广告
            </Button>
          </>
        )}
        {data && canViewShare && (
          <View>
            <View>
              <Text>资源信息:</Text>
            </View>
            <View style={{ paddingLeft: "25px" }}>
              <Text>资源链接:</Text>
              <Text>{data.shareUrl}</Text>
              <View style={{ textAlign: "left" }}>
                <Button
                  className="copy"
                  onClick={() => this.handleClickCopyUrl(data.shareUrl)}
                >
                  复制链接
                </Button>
              </View>
            </View>
            <View style={{ paddingLeft: "25px" }}>
              <Text>链接密码:</Text>
              <Text>{data.sharePsw}</Text>
              <View style={{ textAlign: "left" }}>
                <Button
                  className="copy"
                  onClick={() => this.handleClickCopyPsw(data.sharePsw)}
                >
                  复制密码
                </Button>
              </View>
            </View>
          </View>
        )}
        {haveData === false && <View>没有搜索到此资源相关信息</View>}
        <View
          style={{
            position: "fixed",
            width: "100%",
            bottom: 0,
            borderTop: "1px solid #e9e9e9",
          }}
        >
          <TabBar
            noSplit
            dots={[]}
            width="50%"
            activeColor="#688aef"
            style={{ fontWeight: 400, color: "#999" }}
            defaultSelect={"特定搜索"}
            options={["特定搜索", "网盘搜索"]}
            onChange={(tabName) => {
              if (tabName !== "特定搜索") {
                Taro.redirectTo({
                  url: "../baiduSearch/index",
                });
              }
            }}
          ></TabBar>
        </View>
      </View>
    );
  }
}
