'use client';

import { useEffect, useMemo } from 'react';
import { useSales } from '../contexts/SalesContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BarChart3, 
  Download, 
  MapPin, 
  DollarSign, 
  Ticket,
  TrendingUp,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface SalesReportProps {
  open: boolean;
  onClose: () => void;
}

export function SalesReport({ open, onClose }: SalesReportProps) {
  const { sales, getSalesReport, refreshSales } = useSales();

  // Refresh sales when dialog opens
  useEffect(() => {
    if (open) {
      refreshSales();
    }
  }, [open, refreshSales]);

  // Auto-refresh every 3 seconds when open
  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        refreshSales();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [open, refreshSales]);

  // Compute report using useMemo to avoid infinite loops
  const report = useMemo(() => {
    if (!open || sales.length === 0) return null;
    return getSalesReport();
  }, [open, sales, getSalesReport]);

  if (!report) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-none sm:max-w-none w-[calc(100vw-1rem)] max-h-[95vh] overflow-y-auto p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-1.5 text-base">
              <BarChart3 className="w-4 h-4" />
              Complete Sales Report
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground text-sm">
            No sales data available yet.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleExport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalSales: report.totalSales,
        totalRevenue: report.totalRevenue
      },
      byLocation: Object.entries(report.salesByLocation).map(([location, data]) => ({
        location,
        ticketCount: data.count,
        revenue: data.revenue
      })),
      byConcert: Object.entries(report.salesByConcert).map(([concertId, data]) => ({
        concertId,
        ticketCount: data.count,
        revenue: data.revenue
      })),
      allSales: report.allSales.map(sale => ({
        id: sale.id,
        concertName: sale.concertName,
        location: sale.location,
        adminLocation: sale.adminLocation,
        adminUsername: sale.adminUsername,
        ticketCount: sale.tickets.length,
        totalAmount: sale.totalAmount,
        saleDate: sale.saleDate,
        paymentMethod: sale.paymentMethod,
        bookingReference: sale.bookingReference
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none sm:max-w-none w-[calc(100vw-1rem)] max-h-[95vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-1.5 text-base">
              <BarChart3 className="w-4 h-4" />
              Complete Sales Report
            </DialogTitle>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 h-7 text-xs px-2">
                <Download className="w-3 h-3" />
                Export
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Total Tickets</p>
                    <p className="text-lg font-bold">{report.totalSales}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-bold">{report.totalRevenue.toLocaleString()} IQD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Locations</p>
                    <p className="text-lg font-bold">
                      {Object.keys(report.salesByLocation).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Location */}
          <Card>
            <CardHeader className="p-2 pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                Sales by Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-8">
                      <TableHead className="text-xs px-2 py-1">Location</TableHead>
                      <TableHead className="text-xs px-2 py-1">Tickets</TableHead>
                      <TableHead className="text-xs px-2 py-1">Revenue</TableHead>
                      <TableHead className="text-xs px-2 py-1">Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.salesByLocation)
                      .sort((a, b) => b[1].revenue - a[1].revenue)
                      .map(([location, data]) => (
                        <TableRow key={location} className="h-7">
                          <TableCell className="text-xs px-2 py-1 font-medium">{location}</TableCell>
                          <TableCell className="text-xs px-2 py-1">{data.count}</TableCell>
                          <TableCell className="text-xs px-2 py-1">{data.revenue.toLocaleString()} IQD</TableCell>
                          <TableCell className="text-xs px-2 py-1">{data.sales.length}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Sales by Concert */}
          <Card>
            <CardHeader className="p-2 pb-1">
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                Sales by Concert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-8">
                      <TableHead className="text-xs px-2 py-1">Concert</TableHead>
                      <TableHead className="text-xs px-2 py-1">Tickets</TableHead>
                      <TableHead className="text-xs px-2 py-1">Revenue</TableHead>
                      <TableHead className="text-xs px-2 py-1">Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.salesByConcert)
                      .sort((a, b) => b[1].revenue - a[1].revenue)
                      .map(([concertId, data]) => {
                        const firstSale = data.sales[0];
                        return (
                          <TableRow key={concertId} className="h-7">
                            <TableCell className="text-xs px-2 py-1 font-medium">
                              {firstSale?.concertName || concertId}
                            </TableCell>
                            <TableCell className="text-xs px-2 py-1">{data.count}</TableCell>
                            <TableCell className="text-xs px-2 py-1">{data.revenue.toLocaleString()} IQD</TableCell>
                            <TableCell className="text-xs px-2 py-1">{data.sales.length}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* All Sales Details */}
          <Card>
            <CardHeader className="p-2 pb-1">
              <CardTitle className="text-sm">All Sales Details</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-8">
                      <TableHead className="text-xs px-1.5 py-1">Date</TableHead>
                      <TableHead className="text-xs px-1.5 py-1">Concert</TableHead>
                      <TableHead className="text-xs px-1.5 py-1">Location</TableHead>
                      <TableHead className="text-xs px-1.5 py-1">Admin</TableHead>
                      <TableHead className="text-xs px-1.5 py-1">Tickets</TableHead>
                      <TableHead className="text-xs px-1.5 py-1">Amount</TableHead>
                      <TableHead className="text-xs px-1.5 py-1">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.allSales
                      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
                      .map((sale, index) => (
                        <TableRow key={`${sale.id}-${sale.saleDate}-${sale.bookingReference}-${index}`} className="h-7">
                          <TableCell className="text-xs px-1.5 py-1 whitespace-nowrap">
                            {new Date(sale.saleDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell className="text-xs px-1.5 py-1 font-medium">{sale.concertName}</TableCell>
                          <TableCell className="text-xs px-1.5 py-1">{sale.location}</TableCell>
                          <TableCell className="text-xs px-1.5 py-1">
                            <div>
                              <p className="font-medium leading-tight">{sale.adminUsername}</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">{sale.adminLocation}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs px-1.5 py-1">{sale.tickets.length}</TableCell>
                          <TableCell className="text-xs px-1.5 py-1">{sale.totalAmount.toLocaleString()} IQD</TableCell>
                          <TableCell className="text-xs px-1.5 py-1">
                            <Badge variant={sale.paymentMethod === 'cash' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 h-4">
                              {sale.paymentMethod}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

