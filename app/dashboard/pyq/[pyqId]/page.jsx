"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/utils/db";
import { Question } from "@/utils/schema";
import { eq } from "drizzle-orm";

const Page = ({ params }) => {
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    console.log("params.pyqId:", params?.pyqId);
    if (params?.pyqId) {
      console.log("Fetching data for pyqId:", params.pyqId);
      getQuestionDetails();
    }
  }, [params?.pyqId]);

  const getQuestionDetails = async () => {
    try {
      const result = await db
        .select()
        .from(Question)
        .where(eq(Question.mockId, params.pyqId));

      console.log("Database result:", result);

      if (result.length > 0) {
        const MockQuestionJsonResp = result[0].MockQuestionJsonResp;
        console.log("Raw JSON Response:", MockQuestionJsonResp);

        try {
          const parsedData = JSON.parse(MockQuestionJsonResp);
          console.log("Parsed Data:", parsedData);

          // Ensure that you access the correct key: "Interview Questions"
          const interviewQuestions = parsedData["Interview Questions"];

          if (interviewQuestions) {
            setQuestionData(interviewQuestions);
          } else {
            console.error("No 'Interview Questions' found in the response");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.error("No data found for the given pyqId");
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  return (
    questionData.length > 0 && (
      <div className="p-10 my-5">
        <Accordion type="single" collapsible>
          {questionData.map((item, index) => (
            <AccordionItem value={`item-${index + 1}`} key={item.Question} className="mb-5">
              <AccordionTrigger>{item?.Question}?</AccordionTrigger>
              <AccordionContent>{item?.Answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  );
};

export default Page;
