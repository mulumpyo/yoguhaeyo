import { API_URL } from "../lib/config";

const Home = async () => {

  const data = await fetch(`${API_URL}/api/test`);

  const server = await data.json();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">서버 렌더링 (SSR)</h2>

      <div className="mt-4 p-4 border rounded bg-white">
        <p>{server.serverTime}</p>
      </div>
    </div>
  );
};

export default Home;