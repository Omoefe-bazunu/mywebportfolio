import { useState } from "react";

export const Lessons = () => {
  const lessons = [
    {
      title: "Installation",
      description:
        "Learn how to get Excel installed locally on your Desktop & How to use it on the web",
    },
    {
      title: "Excel Interface",
      description:
        "See how the Excel Application looks like based on the version of Microsoft Office installed and what features are available to you",
    },
    {
      title: "Introduction to WorkBooks",
      description: "Learn how to Open, Rename and Protect workbooks",
    },
    {
      title: "Introduction to WorkSheets",
      description:
        "Learn the steps to Creating, Deleting, Duplicating, Relocating, hiding, Protecting and Inserting Tab Colors",
    },
    {
      title: "Cells in a WorkSheet",
      description:
        "Learn about Cell Naming, Data Entry, Inserting and Deleting Rows & Columns, Expanding the width & Heights of Rows and Columns in a WorkSheet",
    },
    {
      title: "Tabs in a Workbook",
      description:
        "Brief review of commonly used tabs, HOME, INSERT, VIEW, etc",
    },
    {
      title: "Arithmetics Functions",
      description:
        "Learn to perform basic arithmetic functions such as Sum, Minus, Division, Multiplication, Average",
    },
    {
      title: "Non-Arithmetic Functions",
      description:
        "Learn to use some common and useful non-arithmetic functions such as CONCATENATE, LEFT, RIGHT, LEN, TEXT TO COLUMNS, DATE",
    },
    {
      title: "Drop Down Lists",
      description:
        "Learn to create DropDown Lists for advanced filtering and sorting of list items",
    },
    {
      title: "Conditional Functions Part One",
      description:
        "Learn to perform conditional tasks using popular condiditional functions as SUMIF, SUMIFS, COUNTIF, COUNTA",
    },
    {
      title: "Conditional Functions Part Two",
      description:
        "Learn to use the IF Statement to conditionally report data or perform tasks",
    },
    {
      title: "Conditional Functions Part Three",
      description:
        "Learn to use VLOOKUP, a very popular function for data transformation and analysis",
    },
    {
      title: "Tables",
      description:
        "Learn what tables are in Excel, the Benefits, how to create one, Formating, Sorting & Filtering with Tabulated data",
    },
    {
      title: "Charts",
      description:
        "Learn the differemt types of Charts in Excel, When to use them and How to Create them",
    },
    {
      title: "PIVOT TABLES",
      description:
        "Learn to create Pivot tables from Data Range or regular tables and perform advanced Data Analysis",
    },
    {
      title: "PIVOT CHARTS",
      description: "Learn to create and update pivot charts",
    },
    {
      title: "Interactive DashBoards",
      description:
        "Learn to create Interactive and dynamic dashboards for data visualization",
    },
    {
      title: "Power Query/Get and Transform p1",
      description:
        "Learn to import data from an Excel file in your desktop, Transform the data and Automate the Process for future updates. This is important for data analysis purposes",
    },
    {
      title: "Power Query/Get and Transform p2",
      description:
        "Learn to import data from the WEB, Transform the data and Automate the Process for future updates. This is important for data analysis purposes",
    },
    {
      title: "Hyperlinks",
      description:
        "Learn what hyperlinks are and how they can be useful for routing through data in Excel",
    },
    {
      title: "ReUsable Templates",
      description:
        "Learn to create templates for data entry, analysis and visualization",
    },
    {
      title: "AI and EXCEL",
      description:
        "Learn to use AI assistant to get helpful formulas and functions in Excel",
    },

    {
      title: "Marketing Your Skill",
      description:
        "Learn to market your Excel skills and earn as much as you can.",
    },

    {
      title: "Projects",
      description:
        "Let us work on some moer projects with what we have learned in this course",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-excel2">
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className="text-primary text-lg font-semibold">
          What You Will Learn
        </p>
        <hr className="w-8 h-0.5 bg-primary my-2" />
        <p className="border-y-2 border-primary py-4 text-center text-primary">
          This is a comprehensive course that introduces you to the basic,
          intermediate and advanced topics of Microsoft Excel, a well
          sought-after tool in many organizations across different
          sectors/industries.
        </p>
        <div className="w-full mt-6">
          {lessons.map((lesson, index) => (
            <div key={index} className="w-full text-white mb-4">
              <div
                className="flex justify-between items-center cursor-pointer bg-green-700 p-4"
                onClick={() => toggleDescription(index)}
              >
                <p className="font-semibold">
                  Lesson {index + 1}: {lesson.title}
                </p>
                <span>{expandedIndex === index ? "−" : "+"}</span>
              </div>
              {expandedIndex === index && (
                <p className="mt-2 text-sm bg-gray-800 p-4">
                  {lesson.description || "No description available."}
                </p>
              )}
            </div>
          ))}
        </div>
        <a href="https://selar.co/w21g55" target="_blank">
          <p className="px-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white text-center">
            GET COURSE
          </p>
        </a>
      </div>
    </div>
  );
};
