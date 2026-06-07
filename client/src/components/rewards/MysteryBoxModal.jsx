import React, { useState } from 'react';
import { Package, X, Coins } from 'lucide-react';
import useStore from '../../store/useStore';

const MysteryBoxModal = ({ onClose }) => {
    const { mysteryBoxes, setStats, addCoins, coins } = useStore();

    const [opening, setOpening] = useState(false);
    const [reward, setReward] = useState(null);
    const [error, setError] = useState('');

    const handleOpenBox = async () => {
        if (mysteryBoxes <= 0) return;
        setOpening(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/rewards/open-box`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.success) {
                // Fake a delay for animation
                setTimeout(() => {
                    setReward(data.coinsAwarded);
                    setStats({ mysteryBoxes: data.mysteryBoxes });
                    addCoins(data.coinsAwarded); 
                }, 1500);
            } else {
                setError(data.message);
                setOpening(false);
            }
        } catch (err) {
            setError('Failed to open box.');
            setOpening(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#13141C] border border-[#6C5CE7]/30 p-8 rounded-2xl w-full max-w-sm relative text-center">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {!reward ? (
                    <>
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#6C5CE7]/20 to-[#6C5CE7]/5 border border-[#6C5CE7]/30 rounded-2xl flex items-center justify-center mb-6">
                            <Package size={48} className={`text-[#A89CFF] ${opening ? 'animate-bounce' : ''}`} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Mystery Box</h2>
                        <p className="text-sm text-gray-400 mb-6">You have {mysteryBoxes} box(es) ready to open.</p>

                        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

                        <button
                            onClick={handleOpenBox}
                            disabled={opening || mysteryBoxes <= 0}
                            className="w-full py-3 rounded-lg bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white font-semibold transition-colors disabled:opacity-50"
                        >
                            {opening ? 'Unlocking...' : 'Open Now'}
                        </button>
                    </>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <div className="w-32 h-32 mx-auto bg-[#FAC775]/20 border border-[#FAC775]/40 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(250,199,117,0.3)]">
                            <Coins size={64} className="text-[#FAC775]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Jackpot!</h2>
                        <p className="text-lg text-[#FAC775] font-semibold mb-6">+{reward} Coins</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                        >
                            Awesome!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MysteryBoxModal;
