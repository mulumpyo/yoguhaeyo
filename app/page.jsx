import { fetchApi } from "@/lib/api";

export const revalidate = 0;

const Home = async () => {
  const server = await fetchApi("/api/test");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">서버 렌더링 (SSR)</h2>
      <div className="mt-4 p-4 border rounded bg-white">
        <p>{server?.serverTime}</p>
      </div>
    </div>
  );
};

export default Home;