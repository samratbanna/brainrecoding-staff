import { createStandaloneToast } from "@chakra-ui/react";
import dayjs from "dayjs";

const { toast } = createStandaloneToast();

export function SuccessAlert(message = "") {
  toast({
    title: "SUCCESS",
    description: message,
    status: "success",
    duration: 4000,
    isClosable: true,
  });
}

export function ErrorAlert(message = "") {
  toast({
    title: "FAILED",
    description: message,
    status: "error",
    duration: 5000,
    isClosable: true,
  });
}


export const getDateRanges = () => {
  const day = dayjs()
  const todayStart = day.startOf('day');
  const todayEnd = day.endOf('day');
  const yesterdayStart = day.subtract(1, 'day').startOf('day');
  const yesterdayEnd = day.subtract(1, 'day').endOf('day');
  const thisMonthStart = day.startOf('month');
  const thisMonthEnd = day.endOf('month');
  const lastMonthStart = day.subtract(1, 'month').startOf('month');
  const lastMonthEnd = day.subtract(1, 'month').endOf('month');
  const thisWeekStart = day.startOf('week');
  const thisWeekEnd = day.endOf('week');

  return {

    todayRange: `${todayStart.format('YYYY-MM-DD')} | ${todayEnd.format('YYYY-MM-DD')}`,
    yesterdayRange: `${yesterdayStart.format('YYYY-MM-DD')} | ${yesterdayEnd.format('YYYY-MM-DD')}`,
    thisMonthRange: `${thisMonthStart.format('YYYY-MM-DD')} | ${thisMonthEnd.format('YYYY-MM-DD')}`,
    lastMonthRange: `${lastMonthStart.format('YYYY-MM-DD')} | ${lastMonthEnd.format('YYYY-MM-DD')}`,
    thisWeekRange: `${thisWeekStart.format('YYYY-MM-DD')} | ${thisWeekEnd.format('YYYY-MM-DD')}`,
    today: {
      startDate: todayStart.format('YYYY-MM-DD'),
      endDate: todayEnd.format('YYYY-MM-DD'),

    },
    yesterday: {
      startDate: yesterdayStart.format('YYYY-MM-DD'),
      endDate: yesterdayEnd.format('YYYY-MM-DD'),
    },
    thisMonth: {
      startDate: thisMonthStart.format('YYYY-MM-DD'),
      endDate: thisMonthEnd.format('YYYY-MM-DD'),
    },
    lastMonth: {
      startDate: lastMonthStart.format('YYYY-MM-DD'),
      endDate: lastMonthEnd.format('YYYY-MM-DD'),

    },
    thisWeek: {
      startDate: thisWeekStart.format('YYYY-MM-DD'),
      endDate: thisWeekEnd.format('YYYY-MM-DD'),

    },


  };
};


