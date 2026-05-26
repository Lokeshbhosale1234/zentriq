package com.fintech.ai;

import com.fintech.entity.Transaction;
import com.fintech.service.TransactionService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin
public class AIController {

    private final GeminiService geminiService;

    private final TransactionService transactionService;

    @GetMapping("/insights")
    public String getInsights(Principal principal) {

        /*
        |--------------------------------------------------------------------------
        | GET USER TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        List<Transaction> transactions =
                transactionService.getUserTransactions(principal.getName());

        /*
        |--------------------------------------------------------------------------
        | BUILD AI PROMPT
        |--------------------------------------------------------------------------
        */

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                Analyze the following financial transactions.

                Provide:
                1. Spending patterns
                2. Saving opportunities
                3. Financial health observations
                4. Budget recommendations

                Keep response concise, practical, and easy to read.

                Transactions:
                """);

        /*
        |--------------------------------------------------------------------------
        | APPEND TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        for (Transaction t : transactions) {

            prompt.append(
                    String.format(
                            """
                            Title: %s
                            Amount: %s
                            Type: %s
                            Category: %s

                            """,
                            t.getTitle(),
                            t.getAmount(),
                            t.getType(),
                            t.getCategory()
                    )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | GENERATE AI RESPONSE
        |--------------------------------------------------------------------------
        */

        return geminiService.generateFinancialInsights(
                prompt.toString()
        );
    }
}