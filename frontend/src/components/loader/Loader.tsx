import './Loader.css';
import loaderGif from '../../assets/344648431.gif';

interface LoaderProps {
    message?: string;
}

export const Loader = ({ message = 'Выполняется анализ страницы...' }: LoaderProps) => {
    return (
        <div className="loader-wrap">
            <div className="loader-card">
                <img src={loaderGif} alt="Loading" className="loader-gif" />
                <div className="loader-text">
                    <h2>Accessibility Checker</h2>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
};