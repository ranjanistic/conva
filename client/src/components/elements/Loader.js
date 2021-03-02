import Loader from "react-loader-spinner";
export const Loading = (size=60) => (
    <Loader
      type="Bars"
      color="#216bf3"
      height={size}
      width={size}
      timeout={0} //infinite
    />
)