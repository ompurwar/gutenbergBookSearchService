import { MakeSIMDuration } from "./entities/sim_duration/index.js";
import { MonthlyExpenseStatement, MonthlyIncomeStatement } from "./service/index.js";
import { AddCashFlowChange, GetCashFlowChangeList } from "./use_cases/cashflow_changes/index.js";
import { AddExpense, DeleteExpense, GetExpenseList, UpdateExpense } from "./use_cases/expense/index.js";
import { AddIncome, DeleteIncome, GetIncomeList, UpdateIncome } from "./use_cases/income/index.js";
import { GetMonth } from "./utils/utils.js";

try {
    const duration = MakeSIMDuration(32)
    // await DeleteIncome({ id: 'i1' });
    await DeleteIncome({ id: 'i3' });
    // let new_income = await AddIncome({
    //     id: 'i1',
    //     type: "p",
    //     category: 'i',
    //     frequency: "m",
    //     amount: 10000,
    //     desc: "Salary",
    //     start_month: 15,
    //     end_month: 40,
    //     user_id: "kdjaskd"
    // });
    let new_income = await AddIncome({
        id: 'i3',
        type: "p",
        category: 'i',
        frequency: 'm',
        amount: 10000,
        desc: "Salary",
        start_month: 3,
        end_month: 7,
        user_id: "kdjaskd"
    });
    // new_income = await UpdateIncome({
    //     id: 'i2',
    //     type: "o",
    //     category: 'i',
    //     frequency: null,
    //     amount: 10000,
    //     desc: "Salary edited 2",
    //     start_month: 11,
    //     end_month: 11,
    //     user_id: "kdjaskd"
    // });
    await AddCashFlowChange({
        month: 24,
        category: "i",
        cashflow_id: "i1",// income|expense id
        change_type: 'f',
        value: 2000,
        user_id: 'kdjaskd'
    })
    await DeleteExpense({ id: 'e1' });
    await DeleteExpense({ id: 'e2' });
    let new_expense = await AddExpense({
        id: 'e1',
        type: "o",
        frequency: null,
        amount: 10000,
        desc: "Expense",
        start_month: 11,
        end_month: 11,
        user_id: "kdjaskd"
    })
    new_expense = await AddExpense({
        id: 'e2',
        type: "o",
        frequency: null,
        amount: 1500,
        desc: "Expense",
        start_month: 11,
        end_month: 11,
        user_id: "kdjaskd"
    })
    let updated_expense = await UpdateExpense({
        id: 'e1',
        type: "p",
        frequency: 'q',
        amount: 10000,
        desc: "Quarterly Expense",
        start_month: 11,
        end_month: 11,
        user_id: "kdjaskd"
    });
    let cashflow_changes = await GetCashFlowChangeList();
    let income_list = await GetIncomeList();
    let expense_list = await GetExpenseList();

    console.clear();
    console.log("========cashflow change list========");
    console.table(cashflow_changes);
    console.log("========Income list========");
    console.table(income_list);
    console.log("========Expense list========");
    console.table(expense_list);
    let income_statement = await MonthlyIncomeStatement.GetMonthlyIncomeList(duration.Get(), income_list, cashflow_changes);
    let expense_statement = await MonthlyExpenseStatement.GetMonthlyExpenseList(duration.Get(), expense_list, cashflow_changes);
    // console.log(JSON.stringify(income_statement, null, 2));
    console.log("========Expense statement========");
    console.table(expense_statement)
    console.table(JSON.stringify(expense_statement,null,2))
    console.log("========Income statement========");
    console.table(income_statement)
    // console.log(JSON.stringify(expense_statement, null, 2))
    console.log(GetMonth('oct-2021', 'nov-2021'))
} catch (error) {
    console.log(error);
}