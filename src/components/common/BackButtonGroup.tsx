import { Button } from 'react-bootstrap';

interface BackButton {
    text: string;
    variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
    onClick: () => void;
    className?: string;
}

interface BackButtonGroupProps {
    buttons: BackButton[];
    className?: string;
}

const BackButtonGroup = ({ buttons, className = 'd-flex justify-content-end align-items-center mb-4' }: BackButtonGroupProps) => {
    return (
        <div className={className}>
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    variant={button.variant || 'outline-primary'}
                    onClick={button.onClick}
                    className={button.className || (index > 0 ? 'ms-2' : '')}>
                    {button.text}
                </Button>
            ))}
        </div>
    );
};

export default BackButtonGroup;
