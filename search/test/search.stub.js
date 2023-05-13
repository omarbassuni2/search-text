export const formattedQueryObject = () => {
  return {
    name: "Hopkins Hospital Baltimore",
    stateName: "Florida",
    availability: [
      new Date().setHours(..."10:00".split(":")),
      new Date().setHours(..."20:00".split(":")),
    ],
  };
};

export const rawQueryObject = () => {
  return {
    clinicName: "Hopkins Hospital Baltimore",
    stateName: "Florida",
    availability: '["10:00", "20:00"]',
  };
};

export const listOfClinics = () => {
  return [
    {
      name: "Hopkins Hospital Baltimore",
      stateName: "Florida",
      availability: {
        from: "07:00",
        to: "22:00",
      },
    },
    {
      name: "Mayo Clinic",
      stateName: "Florida",
      availability: {
        from: "09:00",
        to: "20:00",
      },
    },
    {
      name: "Cleveland Clinic",
      stateName: "New York",
      availability: {
        from: "11:00",
        to: "22:00",
      },
    },
    {
      clinicName: "Good Health Home",
      stateCode: "FL",
      opening: {
        from: "15:00",
        to: "20:00",
      },
    },
    {
      clinicName: "National Veterinary Clinic",
      stateCode: "CA",
      opening: {
        from: "15:00",
        to: "22:30",
      },
    },
  ];
};
