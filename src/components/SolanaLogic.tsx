import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Eye, EyeOff, Trash } from 'lucide-react'; // Importing eye icons from Lucid React
import bs58 from 'bs58'
import copyToClipboard from '@/actions/copy';

interface Keys{
  publicKey: string,
  privateKey: string
}

export default function SolanaLogic({ mnemonic }: { mnemonic: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState<Keys[]>([]);
    const [visibility, setVisibility] = useState<boolean[]>([]);

    const toggleVisibility = (index: number) => {
        setVisibility((prev) =>
            prev.map((v, i) => (i === index ? !v : v))
        );
    };

    const handleAddWallet = async () => {
        const seed = mnemonicToSeedSync(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const { key: derivedSeed } = derivePath(path, seed.toString('hex'));
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        setPublicKeys((prev) => [...prev, { publicKey: keypair.publicKey.toBase58(), privateKey: bs58.encode(keypair.secretKey) }]);
        setVisibility((prev) => [...prev, false]); // Default to hidden
        setCurrentIndex((prev) => prev + 1);
    };
    const handleDelete = (toDelete: string) => {
      setPublicKeys((prev) => prev.filter((p) => p.publicKey !== toDelete))
    }

    return (
        <div>
            <button onClick={handleAddWallet} className="p-2 bg-blue-500 text-white rounded">
                Add Solana Wallet
            </button>
            {publicKeys.map((key, index) => (
                <div key={key.publicKey} className="flex flex-col justify-center mt-2">
                    <div className='flex justify-between'>
                        <h1 className='text-4xl m-2'>Wallet {index + 1}</h1>
                        <span className='text-red-700 flex justify-center items-center p-2' onClick={() => {handleDelete(key.publicKey)}}><Trash/></span>
                    </div>
                    <div className='flex flex-col w-full p-4 rounded-lg'>
                    <label>Public Key</label>
                    <input
                        type='text'
                        value={key.publicKey}
                        onFocus={() => {copyToClipboard("Public Key", key.publicKey)}}
                        readOnly
                        className="p-2 border rounded bg-transparent w-full my-2"
                    />
                    <div className='flex'>
                    <label>Private Key</label>
                    <button
                        onClick={() => toggleVisibility(index)}
                        className="mx-2 rounded"
                    >
                        {visibility[index] ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                    </div>
                    <input
                        type={visibility[index] ? 'text' : 'password'}
                        value={key.privateKey}
                        onFocus={() => {copyToClipboard("Public Key", key.privateKey)}}
                        readOnly
                        className="p-2 border rounded bg-transparent"
                    />
                    </div>
                </div>
            ))}
        </div>
    );
}