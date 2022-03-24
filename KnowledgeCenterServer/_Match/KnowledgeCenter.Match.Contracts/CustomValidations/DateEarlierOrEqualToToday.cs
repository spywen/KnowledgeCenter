using System.ComponentModel.DataAnnotations;
using System;

namespace KnowledgeCenter.Match.Contracts.CustomValidations
{
    public class DateEarlierOrEqualToToday : ValidationAttribute
    {
        public override string FormatErrorMessage(string name)
        {
            return "Date value should be equal to today's date";
        }

        protected override ValidationResult IsValid(object objValue, ValidationContext validationContext)
        {
            var dateValue = objValue as DateTime? ?? new DateTime();

            var compareResult = DateTime.Compare(dateValue.Date, DateTime.Now.Date);

            return compareResult <= 0
                ? new ValidationResult(FormatErrorMessage(validationContext.DisplayName))
                : ValidationResult.Success;
        }
    }
}