import axios from 'axios';
import { RESTDataSource } from 'apollo-datasource-rest';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

export default class RTDFeedAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.RTD_FEED_URL;
  }

  async getData() {
    const res = await axios.get(`${this.baseURL}/VehiclePosition.pb`, {
      withCredentials: true,
      responseType: 'arraybuffer',
      auth: {
        username: process.env.RTD_FEED_USERNAME,
        password: process.env.RTD_FEED_PASSWORD
      }
    });

    const buffer = Buffer.from(res.data, 'base64');
    return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);
  }
}