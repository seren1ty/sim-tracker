import dbConnect from '@/utils/db-connect';
import Car from '@/models/car.model';
import Lap from '@/models/lap.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { CarDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { game },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      Car.find({ game })
        .collation({ locale: 'en', strength: 2 })
        .then((cars) => {
          let newCars: CarDocument[] = [];

          cars.forEach((car) => {
            Lap.exists({ car: car.name }).then((result) => {
              car._doc.hasLaps = result;
              newCars.push(car);

              if (newCars.length === cars.length) {
                newCars.sort((a, b) => {
                  return a._doc.name > b._doc.name
                    ? 1
                    : b._doc.name > a._doc.name
                    ? -1
                    : 0;
                });

                res.json(newCars);
              }
            });
          });
        })
        .catch((err) =>
          res.status(400).json('Error [Get All Tracks For Game]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Lap operation not supported]');
      break;
  }
}
