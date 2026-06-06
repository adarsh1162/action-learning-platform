import useStore from '../store/useStore';

const Dashboard = () => {
    const { coins, retentionScore } = useStore();

    return (
        <div>
            <h1>Coins: {coins}</h1>
            <p>Retention Score: {retentionScore}</p>
        </div>
    );
};