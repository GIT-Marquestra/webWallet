"use client";

import EtherLogic from "@/components/EtherLogic";
import SolanaLogic from "@/components/SolanaLogic";
import { generateMnemonic } from "bip39";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import copyToClipboard from "@/actions/copy";
import sol from "@/assets/solana.svg"
import eth from "@/assets/ethereum.svg"
import Image from "next/image";

export default function Home() {
  const [mnemonicArray, setMnemonicArray] = useState<string[]>([]);
  const [mnemonic, setMnemonic] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  const handleGenerate = async () => {
    const words12 = await generateMnemonic();
    setMnemonic(words12);
    const wordsArray = words12.split(" ");
    setMnemonicArray(wordsArray);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard("Mnemonic", mnemonic);
      setIsCopied(true);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center space-y-6 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">SolEth Wallet</h1>
      {mnemonic.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl flex font-bold mb-8 text-center"><span><Image src={sol} alt="sol" className="size-9"></Image></span>Generate Your Wallet<span><Image src={eth} alt="eth" className="size-9"></Image></span></h1>
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
        >
          Generate Mnemonic
        </button>
        </div>
      ) : (
        <div className="space-y-6 w-full max-w-lg">
          {/* Copy and Eye Toggle Section */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
              >
                {isCopied ? <span className="font-medium">Mnemonic Copied!</span> : <span>Copy Mnemonic</span>}
              </button>
            </div>
            {/* Eye Toggle */}
            <button
              onClick={() => setShowMnemonic((prev) => !prev)}
              className="text-white bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
            >
              {showMnemonic ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          {/* Mnemonic Words */}
          <div
            className={`grid grid-cols-3 gap-4 bg-gray-800 p-4 rounded-lg shadow-lg ${
              !showMnemonic ? "blur-md" : ""
            }`}
          >
            {mnemonicArray.map((word, index) => (
              <div key={index} className="bg-gray-700 text-center py-2 rounded-md shadow-sm">
                {word}
              </div>
            ))}
          </div>
        </div>
      )}
      {mnemonicArray.length !== 0 && (
        <div className="w-full max-w-4xl space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <span className="text-3xl flex font-bold mb-4 text-center justify-center items-center"><Image src={sol} alt="solana" className="size-9 m-2"></Image>Solana Wallet</span>
            <SolanaLogic mnemonic={mnemonic} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <span className="text-3xl flex font-bold mb-4 text-center justify-center items-center"><Image src={eth} alt="ethereum" className="size-9 m-2"></Image>Ethereum Wallet</span>
            <EtherLogic mnemonic={mnemonic} />
          </div>
        </div>
      )}
    </div>
  );
}