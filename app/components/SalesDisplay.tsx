'use client';

import { useEffect, useState } from 'react';
import { useSales } from '../contexts/SalesContext';
import { useAuth } from '../contexts/AuthContext';
import { TicketSale } from '../types/sales';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, MapPin, Calendar, DollarSign } from 'lucide-react';

export function SalesDisplay() {
  const { sales, refreshSales } = useSales();
  const { adminInfo } = useAuth();
  const [recentSales, setRecentSales] = useState<TicketSale[]>([]);

  useEffect(() => {
    refreshSales();
    // Real-time updates are handled via SSE in SalesContext
    // No need for polling interval
  }, [refreshSales]);

  useEffect(() => {
    // Show last 10 sales
    const sorted = [...sales].sort((a, b) => 
      new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
    );
    setRecentSales(sorted.slice(0, 10));
  }, [sales]);

  // Only show Live Sales Updates for Main Headquarters
  if (!adminInfo || adminInfo.location !== 'Main Headquarters') {
    return null;
  }

  if (sales.length === 0) {
    return null;
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalTickets = sales.reduce((sum, sale) => sum + sale.tickets.length, 0);

  return (
    <div className="border-t bg-muted/30 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Live Sales Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <DollarSign className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} IQD</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Tickets Sold</p>
                  <p className="text-2xl font-bold">{totalTickets}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Locations</p>
                  <p className="text-2xl font-bold">
                    {new Set(sales.map(s => s.adminLocation)).size}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentSales.map((sale, index) => (
                  <div
                    key={`${sale.id}-${sale.saleDate}-${index}`}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{sale.concertName}</p>
                        <Badge variant="outline" className="text-xs">
                          {sale.tickets.length} ticket{sale.tickets.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{sale.adminLocation}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(sale.saleDate).toLocaleString()}</span>
                        </div>
                        <Badge variant={sale.paymentMethod === 'cash' ? 'default' : 'secondary'}>
                          {sale.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{sale.totalAmount.toLocaleString()} IQD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

