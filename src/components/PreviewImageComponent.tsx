import React from "react";
import { EngToTelService } from "../services/engToTelugu";
import PToolTip from "./PToolTip";

interface Props {
  imageComp: any;
  curLang: string;
  updateDisctionary: (str: string) => void;
}

const PreviewImageComponent = ({
  imageComp,
  curLang,
  updateDisctionary,
}: Props) => {
  let ett: EngToTelService = new EngToTelService();
  return (
    <div>
      <img
        src={imageComp["image"]}
        alt="Sample Image"
        width={"100%"}
        style={{
          margin: "0 15px 15px 0",
          aspectRatio: "1 / 1",
        }}
      />
      {imageComp["title"] !== "" && (
        <>
          <p className="text-center">
            <PToolTip
              textToShow={imageComp["title"]}
              curLang={curLang}
              handleClick={updateDisctionary}
            ></PToolTip>
          </p>
        </>
      )}
    </div>
  );
};

export default PreviewImageComponent;
