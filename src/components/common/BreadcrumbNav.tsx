import { Breadcrumb } from 'react-bootstrap';

interface BreadcrumbItem {
    text: string;
    path?: string;
    active?: boolean;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
    navigate: (path: string) => void;
    className?: string;
}

const BreadcrumbNav = ({ items, navigate, className = 'mb-3' }: BreadcrumbNavProps) => {
    const handleClick = (e: React.MouseEvent<HTMLElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <Breadcrumb className={className}>
            {items.map((item, index) => (
                <Breadcrumb.Item
                    key={index}
                    href={item.active ? undefined : item.path}
                    onClick={item.active ? undefined : (e) => handleClick(e, item.path || '')}
                    active={item.active}>
                    {item.text}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default BreadcrumbNav;
