import Joi from 'joi';

export const createBooking = {
  body: Joi.object().keys({
    routeId: Joi.string().required(),
    numberOfTickets: Joi.number().integer().min(1).required(),
  }),
};

export const getBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().required(),
  }),
};

export const cancelBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().required(),
  }),
};
