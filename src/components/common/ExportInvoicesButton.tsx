import React from 'react';
import { Button } from 'react-bootstrap';
import ExcelJS from 'exceljs';

interface ExportInvoicesButtonProps {
    data: Array<{
        campaign_id: number;
        campaign_name: string;
        lineitem_name: string;
        lineitem_id: number;
        booked_amount: number;
        actual_amount: number;
        adjustments: number;
        invoice_id: number;
    }>;
    campaignId: number;
    campaignName: string;
    disabled?: boolean;
    variant?: string;
    className?: string;
    children?: React.ReactNode;
}

const ExportInvoicesButton: React.FC<ExportInvoicesButtonProps> = ({
    data,
    campaignId,
    disabled = false,
    variant = 'outline-primary',
    className = '',
    children = 'Export All Invoices For This Campaign',
}) => {
    const handleExport = async () => {
        if (!data || data.length === 0) {
            console.warn('No data to export');
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet(
                `Campaign ${campaignId} Invoices`
            );

            const headers = [
                'Campaign ID',
                'Campaign Name',
                'Line Item Name',
                'Line Item ID',
                'Booked Amount',
                'Actual Amount',
                'Adjustments',
                'Invoice ID'
            ];

            sheet.addRow(headers);

            data.forEach((item) => {
                sheet.addRow([
                    item.campaign_id,
                    item.campaign_name,
                    item.lineitem_name,
                    item.lineitem_id,
                    item.booked_amount,
                    item.actual_amount,
                    item.adjustments,
                    item.invoice_id,
                ]);
            });

            const columns = [
                { name: 'Campaign ID' },
                { name: 'Campaign Name' },
                { name: 'Line Item Name' },
                { name: 'Line Item ID' },
                { name: 'Booked Amount' },
                { name: 'Actual Amount' },
                { name: 'Adjustments' },
                { name: 'Invoice ID' },
            ];

            sheet.addTable({
                name: 'InvoicesTable',
                ref: 'A1:',
                columns,
                rows: [], // Empty rows since we already added data manually
            });

            // style the table
            const table = sheet.getTable('InvoicesTable');
            table.commit();

            // auto-fit columns
            sheet.columns.forEach((column) => {
                column.width = 20;
            });

            // generate filename
            const currentDate = new Date().toISOString().split('T')[0];
            const filename = `campaign_${campaignId}_invoices_${currentDate}.xlsx`;

            // create and download the file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        } catch (error) {
            console.error('Error exporting Excel file:', error);
        }
    };

    return (
        <Button
            variant={variant}
            onClick={handleExport}
            disabled={disabled}
            className={className}>
            {children}
        </Button>
    );
};

export default ExportInvoicesButton;
