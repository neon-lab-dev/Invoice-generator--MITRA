type LoaderProps = {
  size?: number; // Size in pixels (default is 40)
};

const Loader = ({ size = 40 }: LoaderProps) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: "#2b6473",
  };

  return (
    <div
      className="animate-spin rounded-full border-4 border-gray-200"
      style={style}
    />
  );
};

export default Loader;
