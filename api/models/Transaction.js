"use strict";

import { CustomError } from "../helpers";
import Transaction from "../schemas/Transaction";

const TransactionModel = {
  getAllTransaction,
  getTransaction,
};

export default TransactionModel;

async function getAllTransaction() {
  try {
    const transactionData = await Transaction.find({
      $or: [{ paymentStatus: "ACCEPT" }, { paymentStatus: "NON-PAYMENT" }],
    })
      .populate("userId", "userName")
      .lean();
    return transactionData;
  } catch (error) {
    throw new CustomError(error);
  }
}

async function getTransaction(body) {
  try {
    const { userId } = body;
    const transactionData = await Transaction.find({
      userId,
      paymentStatus: { $in: ["NON-PAYMENT", "ACCEPT"] },
    });
    return transactionData;
  } catch (error) {
    throw new CustomError(error);
  }
}
