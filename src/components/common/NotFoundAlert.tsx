import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface NotFoundAlertProps {
    title: string;
    message: string;
    showBackButton?: boolean;
    backButtonText?: string;
    onBackClick?: () => void;
}

const NotFoundAlert = ({
    title,
    message,
    showBackButton = true,
    backButtonText = 'Back to Campaigns List',
    onBackClick
}: NotFoundAlertProps) => {
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
            <Alert variant="warning">
                <Alert.Heading>{title}</Alert.Heading>
                <p>{message}</p>
                {showBackButton && (
                    <Button
                        variant="outline-warning"
                        onClick={handleBackClick}>
                        {backButtonText}
                    </Button>
                )}
            </Alert>
        </Container>
    );
};

export default NotFoundAlert;
