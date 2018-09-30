user: {
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    active: Boolean; 
    courses: [Course]
}

Course: {
    name: String;
    desc: String;
    key: String;
    //
         startDate: String;
        endDate: String; 
    // ewentualnie coś zastąpić 
        prelectionDays: [{
            day: [Date],
            registrtionOpenTime: Date,// time
            registrationEndTIme: Date,
       }]
    students: [{
        user: User,
        role: String,
        registeredTimePeriod: {
            startTime: Date,
            endTime: Date
        },
        countedPresenceTime: Number
    }]
    //albo ewentualnie jak to zastpić rolami bo ktoś może być użytkownikiem w jednym kursie a w drugim nauczycielem
}