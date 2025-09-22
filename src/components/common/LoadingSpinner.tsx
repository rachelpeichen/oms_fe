import { Container, Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
    return (
        <Container className="p-4">
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">{message}</p>
            </div>
        </Container>
    );
};

export default LoadingSpinner;
