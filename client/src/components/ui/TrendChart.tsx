import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ProductChart {
  productId: string;
  productName: string;
  quantity: number;
}

const generateChart = async (
  startDate: string,
  endDate: string,
  supplierId: string,
  backendUrl: any
): Promise<ProductChart[]> => {
  // Perform HTTP request to your endpoint with the provided date range
  const response = await fetch(`${backendUrl}/api/supplier/${supplierId}/trends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    throw new Error(`Error fetching chart data: ${response.statusText}`);
  }
};

const TrendChart = ({backendUrl}:any) => {
  const [timeFrame, setTimeFrame] = useState<string>('today');
  const [chartData, setChartData] = useState<ProductChart[]>([]);
  const { data: session, status }: any = useSession();
  const supplierId = session?.user?._id;

  const handleTimeFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(event.target.value);
  };

  const generateChartData = async () => {
    let startDate = '';
    let endDate = '';

    // Determine start and end dates based on the selected time frame
    const today = new Date();
    switch (timeFrame) {
      case 'today':
        startDate = today.toISOString().slice(0, 10) + 'T00:00:00Z';
        endDate = today.toISOString().slice(0, 10) + 'T23:59:59Z';
        break;
      case 'lastWeek':
        // Adjust the calculation as needed
        const lastWeekStartDate = new Date(today);
        lastWeekStartDate.setDate(today.getDate() - 7);
        startDate = lastWeekStartDate.toISOString().slice(0, 10) + 'T00:00:00Z';
        endDate = today.toISOString().slice(0, 10) + 'T23:59:59Z';
        break;
      case 'lastMonth':
        // Adjust the calculation as needed
        const lastMonthStartDate = new Date(today);
        lastMonthStartDate.setMonth(today.getMonth() - 1);
        startDate = lastMonthStartDate.toISOString().slice(0, 10) + 'T00:00:00Z';
        endDate = today.toISOString().slice(0, 10) + 'T23:59:59Z';
        break;
      case 'lastYear':
        // Adjust the calculation as needed
        const lastYearStartDate = new Date(today);
        lastYearStartDate.setFullYear(today.getFullYear() - 1);
        startDate = lastYearStartDate.toISOString().slice(0, 10) + 'T00:00:00Z';
        endDate = today.toISOString().slice(0, 10) + 'T23:59:59Z';
        break;
      default:
        break;
    }

    try {
      const result = await generateChart(startDate, endDate, supplierId, backendUrl);
      setChartData(result);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <label htmlFor="timeFrame">Select Time Frame: </label>
      <select id="timeFrame" value={timeFrame} onChange={handleTimeFrameChange}>
        <option value="today">Today</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
        <option value="lastYear">Last Year</option>
      </select>
      <button onClick={generateChartData}>Generate Chart</button>

      {chartData.length > 0 && (
        <div>
          <h2>Generated Chart</h2>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {chartData.map((product) => (
              <div key={product.productId} style={{ marginRight: '10px' }}>
                <div
                  style={{
                    height: `${product.quantity * 10}px`,
                    background: 'blue',
                    margin: '5px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'white', marginBottom: '5px' }}>{product.productName}</span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      color: 'white',
                    }}
                  >
                    {product.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendChart;