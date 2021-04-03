import React, { useState, useEffect } from "react";
import { View, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import "./index.less";

type PageOwnProps = {
  options: any[];
  onChange: Function;
  defaultSelect: String;
  noSplit: Boolean;
  style: Object;
  activeColor: String;
  width: String;
  dots: any[];
};

type IProps = PageOwnProps;

const TabBar: React.FC<IProps> = ({
  defaultSelect,
  style,
  activeColor = false,
  width,
  dots,
  noSplit,
  options = ["菜单一", "菜单二"],
  onChange = () => {},
}) => {
  const [select, setSelect] = useState<any>("网盘搜索");

  useEffect(() => {
    if (defaultSelect) {
      setSelect(defaultSelect);
    }
  }, [defaultSelect]);

  return (
    <ScrollView className={"seckilling-content"} scrollX>
      <View className={"tab-c"}>
        {options.map((name, i) => {
          const active = name == select;
          let newStyle = { ...style };
          const tabActiveStyle = {};

          if (active && activeColor) {
            newStyle["color"] = `${activeColor} !important`;
            tabActiveStyle["background"] = `${activeColor} !important`;
          }

          return (
            <View
              onClick={async () => {
                setSelect(name);
                await onChange(name);
              }}
              className={classNames("tab-i", {
                active,
                "no-split": noSplit,
              })}
              style={{ width }}
              key={name}
            >
              {" "}
              <View className={"tab-t"} style={newStyle}>
                {name}
                {dots[i] && <View className={"dot"}>{dots[i]}</View>}{" "}
              </View>{" "}
              <View
                className={"tab-active"}
                style={{ ...tabActiveStyle }}
              ></View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default TabBar;
