const attachZero = (data) => {
    let temp = Number(data);
    if (temp < 10 && temp >= 0) {
        return '0' + data;
    } else {
        return data;
    }
};

const date = (data, pattern) => {
    let temp = new Date(data);

    if (isNaN(temp)) {
        let now = new Date();
        let timezone = now.getTimezoneOffset();
        let abs = Math.abs(timezone);
        temp = new Date(data.replace(' ', 'T') + (timezone < 0 ? '+' : '-') + attachZero(Math.floor(abs / 60)) + ':' + attachZero(Math.floor(abs % 60)));
    }

    const yyyy = temp.getFullYear();
    const HH = temp.getHours();
    const dateObject = {
        yyyy: yyyy,
        MM: attachZero(temp.getMonth() + 1),
        dd: attachZero(temp.getDate()),
        yy: yyyy.toString().substr(2, 4),
        HH: attachZero(HH),
        hh: attachZero(HH % 12),
        mm: attachZero(temp.getMinutes()),
        ss: attachZero(temp.getSeconds()),
        day: day(temp),
        tt : HH / 12 > 1 ? '오후' : '오전' ,
        TT : HH / 12 > 1 ? 'PM' : 'AM',
    };

    Object.keys(dateObject).forEach(function (key) {
        pattern = pattern.replace(key, dateObject[key]);
    });

    return pattern;
};

const day = date => {
    switch(date.getDay()) {
        case 0:
            return '일';
        case 1:
            return '월';
        case 2:
            return '화';
        case 3:
            return '수';
        case 4:
            return '목';
        case 5:
            return '금';
        case 6:
            return '토';
    }
};

export {
    attachZero,
    date,
    day,
};