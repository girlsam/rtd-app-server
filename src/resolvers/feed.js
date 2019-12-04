export default {
  Query : {
    feed: async(_, { dataSources }) => {
      const feed = await dataSources.rtdFeedAPI.getData();
      console.log(feed);
      return feed;
    }
  }
}