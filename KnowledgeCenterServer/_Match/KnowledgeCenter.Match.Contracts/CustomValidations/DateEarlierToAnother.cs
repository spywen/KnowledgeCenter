using System.ComponentModel.DataAnnotations;
using System;

namespace KnowledgeCenter.Match.Contracts.CustomValidations
{
    public class DateEarlierToAnother : ValidationAttribute
    {
        public DateEarlierToAnother(string dateToCompareToField)
        {
            DateToCompareToField = dateToCompareToField;
        }

        private string DateToCompareToField { get; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var startDate = (DateTime) value;
            var otherDateAttribute = validationContext.ObjectType.GetProperty(DateToCompareToField);

            if (otherDateAttribute == null)
            {
                return new ValidationResult($"No attribute called {DateToCompareToField} was found");
            }

            var endDate = (DateTime) otherDateAttribute.GetValue(validationContext.ObjectInstance, null);
            var result = DateTime.Compare(startDate, endDate);

            return result < 0
                ? ValidationResult.Success
                : new ValidationResult($"Date must be earlier than {DateToCompareToField} date");
        }
    }
}