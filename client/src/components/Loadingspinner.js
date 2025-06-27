import { Circles } from 'react-loader-spinner';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        visible={true}
      />
    </div>
  );
}

export default LoadingSpinner;
