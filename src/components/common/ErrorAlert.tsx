import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ErrorAlertProps {
    error: string;
    title?: string;
    showBackButton?: boolean;
    backButtonText?: string;
    onBackClick?: () => void;
}

const ErrorAlert = ({
    error,
    title = 'Error!',
    showBackButton = true,
    backButtonText = 'Back to Campaigns List',
    onBackClick
}: ErrorAlertProps) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate('/');
        }
    };

    return (
        <Container className="p-4">
            <Alert variant="danger">
                <Alert.Heading>{title}</Alert.Heading>
                <p>{error}</p>
                {showBackButton && (
                    <Button
                        variant="outline-danger"
                        onClick={handleBackClick}>
                        {backButtonText}
                    </Button>
                )}
            </Alert>
        </Container>
    );
};

export default ErrorAlert;
