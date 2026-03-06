export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="loader-3d">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
    </div>
  );
}
