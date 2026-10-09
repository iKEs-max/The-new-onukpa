import Joi from 'joi';

export const createRoute = {
  body: Joi.object().keys({
    departure: Joi.string().required(),
    destination: Joi.string().required(),
    price: Joi.number().min(0).required(),
    departureTime: Joi.date().iso().required(),
    arrivalTime: Joi.date().iso().min(Joi.ref('departureTime')).required(),
    totalSeats: Joi.number().integer().min(1).required(),
    availableSeats: Joi.number().integer().min(1).required(),
  }),
};

export const updateRoute = {
  params: Joi.object().keys({
    routeId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    departure: Joi.string(),
    destination: Joi.string(),
    price: Joi.number().min(0),
    departureTime: Joi.date().iso(),
    arrivalTime: Joi.date().iso().min(Joi.ref('departureTime')),
    status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  }).min(1),
};

export const deleteRoute = {
  params: Joi.object().keys({
    routeId: Joi.string().required(),
  }),
};
