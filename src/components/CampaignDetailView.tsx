import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignDetail } from '../services/api';
import type { CampaignDetail } from '../types';
import { formatCurrency, handleApiError, tableRowHoverStyles } from '../utils/utility';
import { LoadingSpinner, ErrorAlert, NotFoundAlert, BackButtonGroup, BreadcrumbNav } from './common';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Badge,
} from 'react-bootstrap';
import './index.css';

const CampaignDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCampaignDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await fetchCampaignDetail(parseInt(id));
                setCampaign(data);
            } catch (err) {
                setError(handleApiError(err, 'Failed to fetch campaign detail'));
            } finally {
                setLoading(false);
            }
        };

        loadCampaignDetail();
    }, [id]);


    if (loading) {
        return <LoadingSpinner message="Loading campaign details..." />;
    }

    if (error) {
        return <ErrorAlert error={error} />;
    }

    if (!campaign) {
        return (
            <NotFoundAlert
                title="Campaign Not Found"
                message="The requested campaign could not be found."
            />
        );
    }

    const breadcrumbItems = [
        { text: 'Campaigns List', path: '/' },
        { text: 'Campaign Detail', active: true }
    ];

    const backButtons = [
        { text: 'Back to Campaigns List', onClick: () => navigate('/') }
    ];

    return (
        <Container className="p-4">
            <BreadcrumbNav items={breadcrumbItems} navigate={navigate} />
            <BackButtonGroup buttons={backButtons} />

            {/* Campaign Information */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Campaign Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <p>
                                    <strong>Campaign ID:</strong> {campaign.id}
                                </p>
                                <p>
                                    <strong>Campaign Name:</strong>{' '}
                                    {campaign.name}
                                </p>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Line Items and Invoices */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                Line Items & Invoices
                                <Badge bg="secondary" className="ms-2">
                                    {campaign.LineItems.length} items
                                </Badge>
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {campaign.LineItems.length === 0 ? (
                                <p className="text-muted text-center py-4">
                                    No line items found for this campaign
                                </p>
                            ) : (
                                <Table striped hover responsive>
                                    <thead className="table-primary">
                                        <tr>
                                            <th className="text-center">
                                                Line Item ID
                                            </th>
                                            <th className="text-center">
                                                Line Item Name
                                            </th>
                                            <th className="text-center">
                                                Booked Amount
                                            </th>
                                            <th className="text-center">
                                                Actual Amount
                                            </th>
                                            <th className="text-center">
                                                Adjustment
                                            </th>
                                            <th className="text-center">
                                                Final Amount
                                            </th>
                                            <th className="text-center">
                                                Invoice ID
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaign.LineItems.map((lineItem) => (
                                            <tr
                                                key={lineItem.id}
                                                style={tableRowHoverStyles}
                                                onClick={() => navigate(`/lineitems/${lineItem.id}`)}
                                                className="table-row-hover"
                                            >
                                                <td className="text-center fw-medium">
                                                    {lineItem.id}
                                                </td>
                                                <td className="text-start fw-medium">
                                                    {lineItem.name}
                                                </td>
                                                <td className="text-center text-primary fw-bold">
                                                    {formatCurrency(
                                                        lineItem.booked_amount
                                                    )}
                                                </td>
                                                <td className="text-center text-success fw-bold">
                                                    {formatCurrency(
                                                        lineItem.actual_amount
                                                    )}
                                                </td>
                                                <td className="text-center text-warning fw-bold">
                                                    {formatCurrency(
                                                        lineItem.Invoice
                                                            .adjustments
                                                    )}
                                                </td>
                                                <td className="text-center text-info fw-bold">
                                                    {formatCurrency(
                                                        lineItem.actual_amount +
                                                            lineItem.Invoice
                                                                .adjustments
                                                    )}
                                                </td>
                                                <td className="text-center fw-medium">
                                                    {lineItem.Invoice.id}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CampaignDetailView;
