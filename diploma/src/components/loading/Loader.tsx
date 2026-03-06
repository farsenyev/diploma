import './loader.css';

interface LoaderProps {
  message?: string;
}

export const Loader = ({ message = 'Загрузка...' }: LoaderProps) => {
  return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  );
};
