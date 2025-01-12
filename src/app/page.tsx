"use client";

import EtherLogic from "@/components/EtherLogic";
import SolanaLogic from "@/components/SolanaLogic";
import { generateMnemonic } from "bip39";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import copyToClipboard from "@/actions/copy";

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
      <h1 className="text-4xl font-bold mb-8 text-center">Generate Your Wallet</h1>
      {mnemonic.length === 0 ? (
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
        >
          Generate Mnemonic
        </button>
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
            <h2 className="text-3xl font-bold mb-4 text-center">Solana Wallet</h2>
            <SolanaLogic mnemonic={mnemonic} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Ethereum Wallet</h2>
            <EtherLogic mnemonic={mnemonic} />
          </div>
        </div>
      )}
    </div>
  );
}