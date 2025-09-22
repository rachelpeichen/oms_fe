import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvoiceDetail, updateInvoiceAdjustment } from '../services/api';
import type { InvoiceDetail } from '../types';
import { formatCurrency } from '../utils/utility';
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    Button,
    Breadcrumb,
    Form,
    InputGroup,
} from 'react-bootstrap';

const InvoiceDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // state for editing adjustments
    const [isEditingAdjustments, setIsEditingAdjustments] = useState(false);
    const [adjustmentsValue, setAdjustmentsValue] = useState<string>('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadInvoiceDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await fetchInvoiceDetail(parseInt(id));
                setInvoice(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch invoice detail'
                );
            } finally {
                setLoading(false);
            }
        };

        loadInvoiceDetail();
    }, [id]);


    const handleEditAdjustments = () => {
        if (invoice) {
            setAdjustmentsValue(invoice.adjustments.toString());
            setIsEditingAdjustments(true);
            setError(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingAdjustments(false);
        setAdjustmentsValue('');
    };

    const handleSaveAdjustments = async () => {
        if (!invoice || !adjustmentsValue || !id) return;

        try {
            setSaving(true);
            const newAdjustments = parseFloat(adjustmentsValue);

            if (isNaN(newAdjustments)) {
                setError('Please enter a valid number');
                return;
            }

            const response = await updateInvoiceAdjustment(parseInt(id), newAdjustments);

            // update the local state with the response from the server
            setInvoice(prev => prev ? {
                ...prev,
                adjustments: response.data.adjustments
            } : null);

            setIsEditingAdjustments(false);
            setAdjustmentsValue('');

        } catch (error) {
            console.error('Error saving adjustments:', error);
            setError('Failed to save adjustments');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="p-4">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading invoice details...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="p-4">
                <Alert variant="danger">
                    <Alert.Heading>Error!</Alert.Heading>
                    <p>{error}</p>
                    <Button
                        variant="outline-danger"
                        onClick={() => navigate('/')}>
                        Back to Campaigns List
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!invoice) {
        return (
            <Container className="p-4">
                <Alert variant="warning">
                    <Alert.Heading>Invoice Not Found</Alert.Heading>
                    <p>The requested invoice could not be found.</p>
                    <Button
                        variant="outline-warning"
                        onClick={() => navigate('/')}>
                        Back to Campaigns List
                    </Button>
                </Alert>
            </Container>
        );
    }

    const finalAmount = invoice.LineItem.actual_amount + invoice.adjustments;

    return (
        <Container className="p-4">
            <Breadcrumb className="mb-3">
                <Breadcrumb.Item
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}>
                    Campaigns List
                </Breadcrumb.Item>
                <Breadcrumb.Item
                    href={`/campaigns/${invoice.LineItem.campaign_id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/campaigns/${invoice.LineItem.campaign_id}`);
                    }}>
                    Campaign Detail
                </Breadcrumb.Item>
                <Breadcrumb.Item
                    href={`/lineitems/${invoice.line_item_id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/lineitems/${invoice.line_item_id}`);
                    }}>
                    LineItem Detail
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Invoice Detail</Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex justify-content-end align-items-center mb-4">
                <Button
                    variant="outline-secondary"
                    onClick={() =>
                        navigate(`/lineitems/${invoice.line_item_id}`)
                    }
                    className="me-2">
                    Back to LineItem Detail
                </Button>
                <Button variant="outline-primary" onClick={() => navigate('/')}>
                    Back to Campaigns List
                </Button>
            </div>

            {/* Invoice Information */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Invoice Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <p>
                                        <strong>Invoice ID:</strong>{' '}
                                        {invoice.id}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center">
                                        <strong>Adjustments:</strong>
                                        {isEditingAdjustments ? (
                                            <div className="d-flex align-items-center ms-2">
                                                <InputGroup size="sm" style={{ width: '200px' }}>
                                                    <InputGroup.Text>$</InputGroup.Text>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        value={adjustmentsValue}
                                                        onChange={(e) => setAdjustmentsValue(e.target.value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </InputGroup>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="ms-2"
                                                    onClick={handleSaveAdjustments}
                                                    disabled={saving || !adjustmentsValue}
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    className="ms-1"
                                                    onClick={handleCancelEdit}
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center ms-2">
                                                <span className="fw-bold text-warning">
                                                    {formatCurrency(invoice.adjustments)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    className="ms-2"
                                                    onClick={handleEditAdjustments}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Financial Summary */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Financial Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h6 className="text-primary">
                                            Booked Amount
                                        </h6>
                                        <h4 className="text-primary fw-bold">
                                            {formatCurrency(
                                                invoice.LineItem.booked_amount
                                            )}
                                        </h4>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h6 className="text-success">
                                            Actual Amount
                                        </h6>
                                        <h4 className="text-success fw-bold">
                                            {formatCurrency(
                                                invoice.LineItem.actual_amount
                                            )}
                                        </h4>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h6 className="text-warning">
                                            Adjustments
                                        </h6>
                                        <h4 className="text-warning fw-bold">
                                            {formatCurrency(
                                                invoice.adjustments
                                            )}
                                        </h4>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 border border-info rounded bg-light">
                                        <h6 className="text-info">
                                            Final Amount
                                        </h6>
                                        <h4 className="text-info fw-bold">
                                            {formatCurrency(finalAmount)}
                                        </h4>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Line Item Information */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                Related Line Item & Campaign Information
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <p>
                                        <strong>Line Item ID:</strong>{' '}
                                        {invoice.line_item_id}
                                    </p>
                                    <p>
                                        <strong>Line Item Name:</strong>{' '}
                                        {invoice.LineItem.name}
                                    </p>
                                    <p>
                                        <strong>Campaign ID:</strong>{' '}
                                        {invoice.LineItem.campaign_id}
                                    </p>
                                    <p>
                                        <strong>Campaign Name:</strong>{' '}
                                        {invoice.LineItem.Campaign.name}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p>
                                        <strong>Booked Amount:</strong>
                                        <span className="ms-2 text-primary fw-bold">
                                            {formatCurrency(
                                                invoice.LineItem.booked_amount
                                            )}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Actual Amount:</strong>
                                        <span className="ms-2 text-success fw-bold">
                                            {formatCurrency(
                                                invoice.LineItem.actual_amount
                                            )}
                                        </span>
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InvoiceDetailView;
