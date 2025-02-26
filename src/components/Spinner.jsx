import spinner from "../assets/loading.svg";

export default function Spinner() {
  return (
    <img
      src={spinner}
      alt="spinner"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20"
    />
  );
}
