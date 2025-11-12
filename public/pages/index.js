export const getServerSideProps = async () => {
  return {
    props: { time: new Date().toISOString() },
  };
};

const Home = ({ time }) => {
  return (
    <div>
      <h1>SSR</h1>
      <p>서버 시간: {time}</p>
    </div>
  );
};

export default Home;