import { useState, useEffect } from "react";
import { EngToTelService } from "../services/engToTelugu";
import MultiSelectList from "./MultiSelectList";

interface Props {
  text: string;
  curLang: string;
}

const styles = {
  fixedBox: {
    position: "fixed" as const,
    top: "62%",
    height: "60%",
    width: "14%",
    right: "12px",
    transform: "translateY(-50%)",
    background: "#007bff",
    color: "white",
    padding: "10px 20px",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
  },
};

const DictionaryComponent = ({ text, curLang }: Props) => {
  const ett = new EngToTelService();

  const [transWord, setTransWord] = useState("");
  const [transLangs, setTransLangs] = useState([""]);
  const [sl, setSl] = useState("te");

  let word = ett.getStringInUserLanguage(curLang, text);
  let transcri = ett.getStringInTranscript(text);

  function getSelectedLangs(langs: string[]) {
    setTransLangs(langs);
  }

  async function getMeaningInLang(lang: string): Promise<string> {
    let tl: string = "te";
    if (lang == "Sanskrit") tl = "sa";
    if (lang == "en") tl = "en";
    const cacheKey = `${sl}-${tl}-${word}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(
      word
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data?.[0]?.[0]?.[0]) {
        const translation = data[0][0][0];
        localStorage.setItem(cacheKey, JSON.stringify(translation)); // Cache result
        return translation; // No need to parse again, it's already a string
      }

      return "Translation not found";
    } catch (error) {
      console.error("Translation API Error:", error);
      return "Error fetching translation";
    }
  }
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchTranslations = async () => {
      const results: { [key: string]: string } = {};

      for (const lang of transLangs) {
        results[lang] = await getMeaningInLang(lang);
      }

      setTranslations(results);
    };

    fetchTranslations();
  }, [transLangs]);

  useEffect(() => {
    if (!word) return; // Prevent API call if word is empty

    let sourceLang = "te"; // Default: Telugu
    if (curLang === "devanagari") sourceLang = "sa"; // Sanskrit
    setSl(sourceLang);

    // Async function inside useEffect
    const fetchTranslation = async () => {
      const translation = await getMeaningInLang("en");
      setTransWord(translation);
    };

    fetchTranslation();
  }, [word]);

  return (
    <div style={styles.fixedBox}>
      <p style={{ textAlign: "center" }}>🕉 Dictionary 🕉</p>

      <hr />
      <p> {word}</p>

      <hr />
      <p>{transcri}</p>

      <hr />
      <p>{transWord || "Loading..."}</p>
      <hr />
      {/* {transLangs.map((item) => (
        <p key={item}>{translations[item] || "Loading..."}</p>
      ))} */}

      {/* <MultiSelectList getSelectedLangs={getSelectedLangs}></MultiSelectList> */}
    </div>
  );
};

export default DictionaryComponent;
