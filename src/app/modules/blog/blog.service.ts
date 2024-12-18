import { BlogModel } from './blog.model';

const createblog = async (
  blogData: { title: string; content: string },
  authorId: string,
) => {
  // Create a new blog document
  const newBlog = new BlogModel({
    title: blogData.title,
    content: blogData.content,
    author: authorId,
    isPublished: true,
  });

  await newBlog.save();

  const populatedBlog = await newBlog.populate('author');
  return populatedBlog;
};

export const calculateTotalRevenue = async () => {
  // MongoDB AGGREGATION PIPELINE
  const revenueData = await BlogModel.aggregate([
    {
      $lookup: {
        from: 'cars', // REFERENCE TO 'CARS' COLLECTION
        localField: 'car', // FIELD OF THE blog COLLECTION THAT IS REFERENCING THE CAR COLLECTION
        foreignField: '_id',
        as: 'carDetails',
      },
    },
    {
      $unwind: '$carDetails', // EXPECTING ONLY ONE MATCH, THAT'S WHY $unwind
    },
    {
      $match: {
        'carDetails.quantity': { $gt: 0 }, // CAR QUANTITY HAS TO BE MORE THAT 0
      },
    },
    {
      $project: {
        totalRevenue: {
          $multiply: ['$quantity', '$carDetails.price'],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalRevenue' },
      },
    },
  ]);

  return revenueData[0] ? revenueData[0].totalRevenue : 0;
};

export const BlogService = {
  createblog,
  calculateTotalRevenue,
};
