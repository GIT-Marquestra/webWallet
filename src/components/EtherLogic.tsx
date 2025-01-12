import { mnemonicToSeed } from 'bip39';
import { Wallet } from 'ethers';
import { HDNodeWallet } from 'ethers';
import React, { useState } from 'react';
import { Eye, EyeOff, Trash } from 'lucide-react'; // Importing eye icons from Lucid React
import copyToClipboard from '@/actions/copy';

interface Keys{
    address: string,
    privateKey: string 
}

function EtherLogic({ mnemonic }: { mnemonic: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState<Keys[]>([]);
    const [visibility, setVisibility] = useState<boolean[]>([]);

    const toggleVisibility = (index: number) => {
        setVisibility((prev) => prev.map((v, i) => (i === index ? !v : v)));
    };

    const handleCreateWallet = async () => {
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);

        setAddresses((prev) => [...prev, {address: wallet.address, privateKey}]);
        setVisibility((prev) => [...prev, false]); // Default to hidden
        setCurrentIndex((prev) => prev + 1);
    };

    const handleDelete = (toDelete: string) => {
        setAddresses((prev) => prev.filter((p) => p.address !== toDelete))
    }

    return (
        <div>
            <button onClick={handleCreateWallet} className="p-2 bg-blue-500 text-white rounded">
                Add Ethereum Wallet
            </button>
            {addresses.map((ad, index) => (
                <div key={ad.address} className="flex flex-col justify-center mt-2">
                    <div className='flex justify-between'>
                        <h1 className='text-4xl m-2'>Wallet {index + 1}</h1>
                        <span className='text-red-700 flex justify-center items-center p-2' onClick={() => {handleDelete(ad.address)}}><Trash/></span>
                    </div>
                    <div className='flex flex-col w-full p-4 rounded-lg'>
                    <label>Public Key</label>
                    <input
                        type='text'
                        value={ad.address}
                        onFocus={() => {copyToClipboard("Public Key", ad.address)}}
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
                        value={ad.privateKey}
                        onFocus={() => {copyToClipboard("Private Key", ad.privateKey)}}
                        readOnly
                        className="p-2 border rounded bg-transparent"
                    />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EtherLogic;