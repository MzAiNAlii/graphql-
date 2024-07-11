import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

export const generateSixDigitCode = () => {
  const randomNumber = Math.floor(Math.random() * 10000);
  const sixDigitCode = randomNumber.toString().padStart(6, '0');
  return sixDigitCode;
};

export const generateExpireTime = () => {
  const currentTime = new Date();
  let futureTime = new Date(currentTime.getTime() + 60000);
  const expirationTime = futureTime.toTimeString().slice(0, 8);
  return expirationTime;
};

export const verifyUserAge = (dateOfBirth: string): boolean => {
  const dob = moment(dateOfBirth, 'YYYY-MM-DD', true);
  if (!dob.isValid()) {
    throw new BadRequestException(
      'Invalid date of birth format. Please provide a valid date in YYYY-MM-DD format.',
    );
  }
  const age = moment().diff(dob, 'years');
  if (age < 18) {
    throw new BadRequestException('You are below the age of 18.');
  }
  return true;
};
