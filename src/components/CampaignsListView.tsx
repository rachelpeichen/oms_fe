import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Campaign, Pagination } from '../types';
import { fetchCampaigns } from '../services/api';
import { formatCurrency, handleApiError, tableRowHoverStyles } from '../utils/utility';
import { LoadingSpinner, ErrorAlert, BreadcrumbNav } from './common';
import {
    Container,
    Table,
    Badge,
    Pagination as BootstrapPagination,
} from 'react-bootstrap';
import './index.css';

const CampaignsListView = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCampaigns = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchCampaigns(page);
            setCampaigns(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(handleApiError(err, 'Failed to fetch campaigns'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowClick = (campaignId: number) => {
        navigate(`/campaigns/${campaignId}`);
    };


    if (loading) {
        return <LoadingSpinner message="Loading campaigns..." />;
    }

    if (error) {
        return <ErrorAlert error={error} />;
    }

    const renderPagination = () => {
        if (!pagination || pagination.totalPages <= 1) return null;

        const items = [];
        const { currentPage, totalPages, hasPreviousPage, hasNextPage } =
            pagination;

        // Previous button
        items.push(
            <BootstrapPagination.Prev
                key="prev"
                disabled={!hasPreviousPage}
                onClick={() => handlePageChange(currentPage - 1)}
            />
        );

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            items.push(
                <BootstrapPagination.Item
                    key={1}
                    active={currentPage === 1}
                    onClick={() => handlePageChange(1)}>
                    1
                </BootstrapPagination.Item>
            );
            if (startPage > 2) {
                items.push(<BootstrapPagination.Ellipsis key="ellipsis1" />);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <BootstrapPagination.Item
                    key={page}
                    active={currentPage === page}
                    onClick={() => handlePageChange(page)}>
                    {page}
                </BootstrapPagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<BootstrapPagination.Ellipsis key="ellipsis2" />);
            }
            items.push(
                <BootstrapPagination.Item
                    key={totalPages}
                    active={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </BootstrapPagination.Item>
            );
        }

        // Next button
        items.push(
            <BootstrapPagination.Next
                key="next"
                disabled={!hasNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
            />
        );

        return (
            <BootstrapPagination className="justify-content-center mt-4">
                {items}
            </BootstrapPagination>
        );
    };

    const breadcrumbItems = [
        { text: 'Campaigns List', active: true }
    ];

    return (
        <Container className="p-4">
            <BreadcrumbNav items={breadcrumbItems} navigate={navigate} />

            <div className="d-flex justify-content-end align-items-center mb-4">
                {pagination && (
                    <div className="text-muted">
                        Showing{' '}
                        {(currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                        {Math.min(
                            currentPage * pagination.itemsPerPage,
                            pagination.totalItems
                        )}{' '}
                        of {pagination.totalItems} campaigns
                    </div>
                )}
            </div>

            <Table striped hover responsive className="w-100">
                <thead className="table-primary">
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Line Items</th>
                        <th className="text-center">Total Booked</th>
                        <th className="text-center">Total Actual</th>
                        <th className="text-center">Total Adjustment</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4">
                                No campaigns found
                            </td>
                        </tr>
                    ) : (
                        campaigns.map((campaign) => (
                            <tr
                                key={campaign.id}
                                style={tableRowHoverStyles}
                                onClick={() => handleRowClick(campaign.id)}
                                className="table-row-hover"
                            >
                                <td className="fw-medium">{campaign.id}</td>
                                <td className="fw-medium">{campaign.name}</td>
                                <td className="text-center">
                                    <Badge bg="secondary">
                                        {campaign.lineItemCount}
                                    </Badge>
                                </td>
                                <td className="text-end text-primary fw-bold">
                                    {formatCurrency(campaign.totalBooked)}
                                </td>
                                <td className="text-end text-success fw-bold">
                                    {formatCurrency(campaign.totalActual)}
                                </td>
                                <td className="text-end text-warning fw-bold">
                                    {formatCurrency(campaign.totalAdjustment)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {renderPagination()}
        </Container>
    );
};

export default CampaignsListView;
